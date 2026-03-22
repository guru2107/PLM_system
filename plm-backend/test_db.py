import psycopg2

try:
    conn = psycopg2.connect(
        host="127.0.0.1",
        port=5432,
        dbname="plm_db",
        user="postgres",
        password="Jainam051205@",
        sslmode="prefer"
    )
    print("SUCCESS 127.0.0.1")
except Exception as e:
    print(f"FAILED 127.0.0.1: {e}")
