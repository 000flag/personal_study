import pymysql
import json
import os
from datetime import datetime

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
        charset='utf8'
    )
    print(f"\n>>> DB 연결 성공: {db}\n")
    return conn

def get_table_list(cursor, db_name):
    cursor.execute(f"SHOW TABLES FROM `{db_name}`")
    return [row[0] for row in cursor.fetchall()]

def get_datetime_column(cursor, db_name, table):
    cursor.execute("""
        SELECT COLUMN_NAME, DATA_TYPE
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
    """, (db_name, table))

    datetime_columns = [row[0] for row in cursor.fetchall()
                        if row[1].lower() in ("datetime", "timestamp")]

    if not datetime_columns:
        return None

    return datetime_columns[0]

def main():
    conn = get_connection()
    cursor = conn.cursor()
    db_name = conn.db.decode() if isinstance(conn.db, bytes) else conn.db

    tables = get_table_list(cursor, db_name)
    no_datetime_tables = {}

    for table in tables:
        datetime_col = get_datetime_column(cursor, db_name, table)
        if not datetime_col:
            print(f"추출 대상: {table} (datetime 또는 timestamp 컬럼 없음)")
            no_datetime_tables[table] = "datetime/timestamp 컬럼 없음"

    cursor.close()
    conn.close()

    output = json.dumps(no_datetime_tables, indent=2, ensure_ascii=False)

    print("\n결과:")
    print(output)

    filename = f"no_datetime_tables_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    with open(filename, "w", encoding="utf-8") as f:
        f.write(output)

    print(f"\n✔ 결과 파일 저장 완료: {filename}")
    print(f"파일 경로: {os.path.abspath(filename)}")

if __name__ == "__main__":
    main()
