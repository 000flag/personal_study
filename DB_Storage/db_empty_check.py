import pymysql
from datetime import datetime
import json
import os

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

def get_table_list(cursor, db_name):
    cursor.execute(f"SHOW TABLES FROM `{db_name}`")
    return [row[0] for row in cursor.fetchall()]

def is_table_empty(cursor, db_name, table):
    try:
        cursor.execute(f"SELECT COUNT(*) FROM `{db_name}`.`{table}`")
        count = cursor.fetchone()[0]
        return count == 0
    except Exception as e:
        print(f"[ERROR] {table} 컬럼 조회 실패: {e}")
        return False

def main():
    conn = get_connection()
    cursor = conn.cursor()
    db_name = conn.db.decode() if isinstance(conn.db, bytes) else conn.db

    tables = get_table_list(cursor, db_name)
    empty_tables_result = {}

    for table in tables:
        if is_table_empty(cursor, db_name, table):
            print(f"프린 테이블: {table} (데이터 없음)")
            empty_tables_result[table] = {
                "startDate": None,
                "endDate": None,
                "week": {},
                "month": {},
                "year": {}
            }

    cursor.close()
    conn.close()

    output = json.dumps(empty_tables_result, indent=2, ensure_ascii=False)

    print("\n결과:")
    print(output)

    filename = f"db_empty_tables_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(output)

    print(f"\n분석 완료! 결과 파일: {filename}")
    print(f"파일 경로: {os.path.abspath(filename)}")

if __name__ == "__main__":
    main()
