import json
import pandas as pd
import os

def flatten_json_to_dataframe(json_data):
    all_months = set()
    all_years = set()
    table_rows = []

    for table_name, table_data in json_data.items():
        if table_name == "skipped":
            continue

        months = table_data.get("month", {})
        years = table_data.get("year", {})

        all_months.update(months.keys())
        all_years.update(years.keys())

    all_months = sorted(all_months)
    all_years = sorted(all_years)
    columns = ["table"] + all_months + all_years + ["총합 (MB)"]

    for table_name, table_data in json_data.items():
        if table_name == "skipped":
            continue

        row = {"table": table_name}
        total = 0.0

        # 월 단위
        for m in all_months:
            val = table_data.get("month", {}).get(m, "")
            row[m] = val or ""

        # 연 단위 + 총합 계산
        for y in all_years:
            val = table_data.get("year", {}).get(y, "")
            row[y] = val or ""
            if val:
                try:
                    total += float(val.replace(",", ""))
                except ValueError:
                    pass

        row["총합 (MB)"] = f"{total:,.3f}" if total else ""
        table_rows.append(row)

    return pd.DataFrame(table_rows, columns=columns)

def main():
    # filename = "db_size_estimate_20250619.json"  # 파일명
    filename = "db_no_datetime_estimate_20250620_161744.json"
    if not os.path.exists(filename):
        print(f"파일이 존재하지 않습니다: {filename}")
        return

    with open(filename, "r", encoding="utf-8") as f:
        json_data = json.load(f)

    df = flatten_json_to_dataframe(json_data)

    output_filename = "db_size_summary.xlsx"
    df.to_excel(output_filename, index=False)

    print(f"\n✔ 엑셀 파일 생성 완료: {output_filename}")
    print(f"경로: {os.path.abspath(output_filename)}")

if __name__ == "__main__":
    main()
