import psycopg2

conn = psycopg2.connect(
    host='127.0.0.1',
    port=5432,
    user='postgres',
    password='Mfgs@0625',
    database='plm_db'
)
cursor = conn.cursor()

tables = ['users', 'products', 'boms', 'bom_components', 'bom_operations', 'ecos', 'eco_stages']

print("Database row counts:")
print("-" * 40)

for table in tables:
    cursor.execute(f"SELECT COUNT(*) FROM {table}")
    count = cursor.fetchone()[0]
    print(f"{table:<20} {count:>5} rows")

print("-" * 40)

conn.close()
