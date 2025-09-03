# check_tables.py content:
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'digikala.settings')  # Replace with your project name
django.setup()

from django.db import connection
cursor = connection.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
all_tables = [table[0] for table in cursor.fetchall()]

print("All tables:")
for table in sorted(all_tables):
    print(f"  {table}")

print("\nProducts tables:")
products_tables = [t for t in all_tables if t.startswith('products_')]
for table in sorted(products_tables):
    print(f"  ✓ {table}")

if 'products_category' in products_tables:
    print("\n✅ products_category exists!")
else:
    print("\n❌ products_category missing!")
