import io

path = r"D:\daxue\cv\publications.html"
with io.open(path, "r", encoding="utf-8") as f:
    content = f.read()

replacements = [
    # Chinese labels
    "(一作+通讯). ",
    "(共同一作). ",
    "(共同一作+通讯). ",
    "(共同通讯). ",
    "(correspondence, 一作+通讯). ",
    "(独作+通讯). ",
    "(CCF-C, EI, 一作+通讯). ",
    "(CCF-C, EI). ",
    "(EI, 一作+通讯). ",
    "(EI, 通讯). ",
    "(EI). ",
    "(一作). ",
    # English labels
    "(First author). ",
    "(First & corresponding author). ",
    "(Co-first author). ",
    "(Co-first & corresponding author). ",
    "(Co-corresponding author). ",
    "(correspondence, First & corresponding author). ",
    "(Sole & corresponding author). ",
    "(CCF-C, EI, First & corresponding author). ",
    "(EI, First & corresponding author). ",
    "(EI, Corresponding author). ",
]

counts = {}
for label in replacements:
    n = content.count(label)
    if n:
        content = content.replace(label, "")
        counts[label] = n

with io.open(path, "w", encoding="utf-8") as f:
    f.write(content)

for label, n in counts.items():
    print(f"{n}x removed: {label!r}")
