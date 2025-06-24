import pymysql
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
import json
import os

# 날짜 범위 지정 (2000년부터 현재까지)
START_DATE = datetime(2000, 1, 1)
END_DATE = datetime.today()

# MySQL 데이터베이스 연결 함수
def get_connection():
    host = input("DB 호스트: ")
    user = input("DB 사용자명: ")
    password = input("DB 비밀번호: ")
    db = input("DB 이름: ")
    port = int(input("포트 (기본 3306): ") or "3306")

    conn = pymysql.connect(
        host=host,
        user=user,
        password=password,
        db=db,
        port=port,
        charset='utf8',
        connect_timeout=60,
        read_timeout=300,
        write_timeout=300
    )
    print(f"\n>>> DB 연결 성공: {db}\n")
    return conn

# DB 내 모든 테이블 이름 가져오기
def get_table_list(cursor, db_name):
    cursor.execute(f"SHOW TABLES FROM `{db_name}`")
    return [row[0] for row in cursor.fetchall()]

# 해당 테이블에 datetime 또는 timestamp 타입 컬럼이 있는지 여부 확인
def has_datetime_column(cursor, db_name, table):
    cursor.execute("""
        SELECT DATA_TYPE
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
    """, (db_name, table))
    return any(row[0].lower() in ("datetime", "timestamp") for row in cursor.fetchall())

# 평균 row 크기 조회 (바이트 단위)
def get_avg_row_length(cursor, db_name, table):
    cursor.execute("""
        SELECT AVG_ROW_LENGTH
        FROM information_schema.tables
        WHERE table_schema = %s AND table_name = %s
    """, (db_name, table))
    result = cursor.fetchone()
    return result[0] if result and result[0] else 0

# 해당 테이블의 전체 row 수 조회
def get_row_count(cursor, db_name, table):
    cursor.execute(f"SELECT COUNT(*) FROM `{db_name}`.`{table}`")
    return cursor.fetchone()[0]

# 주어진 날짜 범위를 주/월/년 단위로 나누어 라벨, 시작일, 종료일 리스트 반환
def date_range_by_unit(start, end, unit):
    ranges = []
    current = start
    while current < end:
        if unit == 'week':
            next_point = current + timedelta(days=7)
            label = f"{current:%Y-W%U}"
        elif unit == 'month':
            next_point = current + relativedelta(months=1)
            label = f"{current:%Y-%m}"
        elif unit == 'year':
            next_point = current + relativedelta(years=1)
            label = f"{current:%Y}"
        else:
            raise ValueError("단위 오류")
        ranges.append((label, current, next_point))
        current = next_point
    return ranges

# 총 row 수와 평균 row 크기를 기준으로, 구간별 균등 분배하여 용량 추정(MB 단위)
def estimate_evenly_distributed_usage(row_count, avg_len, ranges):
    total_mb = row_count * avg_len / 1024 / 1024
    per_range_mb = total_mb / len(ranges) if ranges else 0
    return {label: f"{per_range_mb:,.3f}" for label, _, _ in ranges}

# 날짜 포맷 안전 변환 함수 (datetime → 문자열)
def safe_date_format(date_obj):
    return date_obj.strftime('%Y-%m-%d') if hasattr(date_obj, 'strftime') else str(date_obj)

# 메인 실행 함수
def main():
    conn = get_connection()
    cursor = conn.cursor()
    db_name = conn.db.decode() if isinstance(conn.db, bytes) else conn.db

    tables = get_table_list(cursor, db_name)
    final_result = {}

    for table in tables:
        if has_datetime_column(cursor, db_name, table):
            continue  # datetime 컬럼이 있으면 건너뜀

        print(f"처리 중 (datetime 없음): {table}")

        avg_len = get_avg_row_length(cursor, db_name, table)
        if avg_len == 0:
            print(f"건너뜀: {table} (AVG_ROW_LENGTH = 0)")
            continue

        row_count = get_row_count(cursor, db_name, table)
        if row_count == 0:
            print(f"건너뜀: {table} (row 없음)")
            continue

        # 테이블별 결과 저장 구조
        table_result = {
            "startDate": safe_date_format(START_DATE),
            "endDate": safe_date_format(END_DATE),
            "week": {},
            "month": {},
            "year": {}
        }

        # 주, 월, 연 단위로 구간 나눠서 균등 분배로 용량 추정
        for unit in ['week', 'month', 'year']:
            ranges = date_range_by_unit(START_DATE, END_DATE, unit)
            usage = estimate_evenly_distributed_usage(row_count, avg_len, ranges)
            table_result[unit] = usage

        final_result[table] = table_result

    # JSON으로 출력
    output = json.dumps(final_result, indent=2, ensure_ascii=False)
    print("\n결과값:")
    print(output)

    # 결과 파일 저장
    filename = f"db_no_datetime_estimate_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(output)

    print(f"\n완료! 결과 파일: {filename}")
    print(f"파일 경로: {os.path.abspath(filename)}")

    cursor.close()
    conn.close()

# 실행 시작
if __name__ == "__main__":
    main()
