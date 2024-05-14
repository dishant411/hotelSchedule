from datetime import datetime, timedelta

html_template = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Days Inn Goldsboro Front Desk Schedule</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            margin: 0;
            padding: 0;
            color: #333;
        }}
        header {{
            background-color: #003366;
            color: white;
            text-align: center;
            padding: 20px 0;
        }}
        .container {{
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 20px;
            max-width: 1200px;
            margin: 20px auto;
            background-color: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            border-radius: 5px;
        }}
        .schedule-section {{
            flex: 3;
        }}
        .notes-section {{
            flex: 1;
            margin-left: 20px;
        }}
        table {{
            width: 100%;
            border-collapse: collapse;
        }}
        th, td {{
            border: 1px solid #ccc;
            padding: 10px;
            text-align: center;
        }}
        th {{
            background-color: #003366;
            color: white;
        }}
        tr:nth-child(even) {{
            background-color: #e6f7ff;
        }}
        input[type="text"], textarea {{
            width: 100%;
            padding: 5px;
            box-sizing: border-box;
            border: 1px solid #ccc;
        }}
        footer {{
            background-color: #003366;
            color: white;
            text-align: center;
            padding: 10px;
            position: fixed;
            bottom: 0;
            width: 100%;
        }}
    </style>
</head>
<body>

<header>
    <h1>Days Inn Goldsboro</h1>
    <h2>Front Desk Employee Schedule</h2>
</header>

<div class="container">
    <section class="schedule-section">
        <h2>Weekly Schedule ({week_range})</h2>
        <table>
            <thead>
                <tr>
                    <th>Employee</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                    <th>Thursday</th>
                    <th>Friday</th>
                    <th>Saturday</th>
                    <th>Sunday</th>
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    </section>
    <section class="notes-section">
        <h2>Notes for Next Week</h2>
        {notes}
    </section>
</div>

<footer>
    <p>&copy; 2024 Hotel Front Desk. All rights reserved.</p>
</footer>

</body>
</html>
"""

row_template = """
<tr>
    <td contenteditable="true">{name}</td>
    {cells}
</tr>
"""

cell_template = """
<td><input type="text" placeholder="Enter shift"></td>
"""

note_template = """
<h3>{name}</h3>
<textarea placeholder="Enter notes"></textarea>
"""

def generate_html(names):
    cells_html = "\n".join(cell_template for _ in range(7))
    rows_html = "\n".join(row_template.format(name=name, cells=cells_html) for name in names)
    notes_html = "\n".join(note_template.format(name=name) for name in names)

    today = datetime.now()
    next_monday = today + timedelta(days=(7 - today.weekday()))
    next_sunday = next_monday + timedelta(days=6)
    week_range = f"{next_monday.strftime('%m/%d/%Y')} TO {next_sunday.strftime('%m/%d/%Y')}"

    html = html_template.format(rows=rows_html, notes=notes_html, week_range=week_range)
    return html

if __name__ == "__main__":
    employee_names = ["Ali", "Urmik", "Nilisha", "Ashley", "Katie"]
    html_content = generate_html(employee_names)
    with open("schedule.html", "w") as file:
        file.write(html_content)

print("HTML content generated and saved to schedule.html")
