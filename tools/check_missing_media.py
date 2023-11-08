import os
import re

# made by Awesome

# Get the main directory path where the tools folder is located
main_dir = os.path.dirname(os.path.dirname(os.path.realpath(__file__)))
qsrc_dir = os.path.join(main_dir, "locations")
# Set the text_path to the main directory
text_path = main_dir

# Get the game directory from the user
image_directory = input('Enter the game directory: ')

# Ensure image_directory ends with a '/'
if not image_directory.endswith('/'):
    image_directory += '/'

# Check if the user entered the images folder path instead of the game directory
if image_directory.lower().endswith('images/'):
    image_directory = os.path.dirname(os.path.dirname(image_directory))

# Remove the 'images' subfolder from image_directory only if it's there
if os.path.basename(image_directory.rstrip('/')).lower() == 'images':
    image_directory = os.path.dirname(image_directory.rstrip('/'))

# Define keywords to exclude from media paths
keywords_to_exclude = ['$pcs_haircol', '<<FUNC', '<<$phonetheme_name[pcs_phonetheme]>>', '<<$ARGS', '+iif']

# Create a list to store missing media (images and videos)
missing_media = []

# Function to evaluate and replace random expressions while preserving existing single quotes or '+' operators
def evaluate_and_replace_random(expression):
    media_paths = []

    # Define a regular expression pattern to find expressions like ' + rand(...) + ' or "'+rand(...)+'" or '<<rand(...)>>'
    rand_pattern = r'(["\']?)\s*([\+\-]?)\s*(<<)?rand\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)(>>)?\s*([\+\-]?)\s*(["\']?)'

    # Find all matching expressions in the input string
    matches = re.finditer(rand_pattern, expression)

    # Initialize the modified expression
    modified_expression = expression

    # Iterate through the matches and replace them
    for match in matches:
        start_quote, start_operator, _, min_value, max_value, _, end_operator, end_quote = match.groups()
        min_value = int(min_value)
        max_value = int(max_value)

        if min_value <= max_value:
            # Generate media paths for each number in the range
            for num in range(min_value, max_value + 1):
                # Create a copy of the modified expression
                temp_expression = modified_expression

                # Replace the 'rand' expression with the current number
                replacement = (start_operator if start_operator else '') + str(num) + (end_operator if end_operator else '')
                if start_quote and start_quote == end_quote:
                    replacement = replacement.strip("'")
                    replacement = replacement.strip("+")

                temp_expression = temp_expression[:match.start()] + replacement + temp_expression[match.end():]
                media_paths.append(temp_expression)

    # If no random evaluations were found, return the original expression
    if not media_paths:
        media_paths = [modified_expression]

    return media_paths


# Function to evaluate and replace variables within a string
def evaluate_and_replace_variables(expression, variables):
    variable_matches = re.findall(r'<<(\$?[a-zA-Z_][a-zAZ0-9_]*)>>', expression)
    for variable_name in variable_matches:
        if variable_name.startswith("$"):
            variable_value = variables.get(variable_name[1:], None)
        else:
            variable_value = variables.get(variable_name, None)
            # Check if the variable value is a 'rand' function
            if isinstance(variable_value, str) and 'rand(' in variable_value:
                # Evaluate the 'rand' function
                variable_value = evaluate_and_replace_random(variable_value)[0]
        if variable_value is None:
            return None
        expression = expression.replace(f"<<{variable_name}>>", str(variable_value))
    return [expression]

# Initialize an empty dictionary to store variable values
variables = {}

# Iterate through .qsrc files in the specified directory and its subdirectories
for file in os.listdir(qsrc_dir):
    if file.endswith(".qsrc"):
        qsrc_file = os.path.join(qsrc_dir, file)

        # Read the .qsrc file
        with open(qsrc_file, "r", encoding="utf-8", errors="ignore") as script_file:
            script_content = script_file.readlines()

        # Initialize a dictionary to store the 'rand' variables and their expressions
        rand_variables = {}

        # Define a regular expression pattern to find 'rand' variable assignments
        rand_assignment_pattern = r'<<(\$?[a-zA-Z_][a-zAZ0-9_]*)>>\s*=\s*(rand\(\d+,\s*\d+\))'

        # Iterate through the script content to find and store 'rand' variable assignments
        for line_number, line in enumerate(script_content, start=1):
            matches = re.findall(rand_assignment_pattern, line)
            for match in matches:
                variable_name, rand_expression = match
                rand_variables[variable_name.strip()] = rand_expression.strip()

        # Iterate through each line in the .qsrc file
        for line_number, line in enumerate(script_content, start=1):
            # Check if the line contains a variable assignment
            if "=" in line and "<<" in line and ">>" in line:
                # Find all matches of the regular expression in the line
                matches = re.findall(r'<<(\$?[a-zA-Z_][a-zAZ0-9_]*)>>\s*=\s*([\'"]?[^\'"]+[\'"]?)', line)
                # Check if there are any matches
                if matches:
                    # Split the line into a variable name and value
                    variable_name, variable_value = matches[0]
                    # Check if the variable value contains a 'rand' function
                    if "rand(" in variable_value:
                        # Evaluate the 'rand' function
                        variable_value = evaluate_and_replace_random(variable_value)[0]
                    # Store the variable value in the dictionary with the filename and line number as the key
                    variables[(qsrc_file, line_number)] = {variable_name.strip(): variable_value.strip("'\"")}

            # Use regular expressions to find media references in the script
            if line.strip().startswith('!') or '<<FUNC' in line:
                continue
            media_references = re.findall(r'<(?:img.*?|video.*?)src="([^"]+)"', line)

            for media_reference in media_references:
                if any(keyword in media_reference for keyword in keywords_to_exclude):
                    continue

                # Find the variable assignment that is closest to (but above) the media reference
                relevant_variables = max(((k, v) for k, v in variables.items() if k[0] == qsrc_file and k[1] < line_number), key=lambda item: item[0][1], default=({}, {}))[1]

                # Evaluate variables first
                media_reference = evaluate_and_replace_variables(media_reference, relevant_variables)
                if media_reference is None:
                    continue
                media_reference = media_reference[0]

                # Use regular expression to identify and replace variables set with rand in the image path
                variable_references = re.findall(r'<<(\$?[a-zA-Z_][a-zAZ0-9_]*)>>', media_reference)
                for variable_reference in variable_references:
                    if variable_reference in rand_variables:
                        rand_expression = rand_variables[variable_reference]
                        media_reference = media_reference.replace(f"<<{variable_reference}>>", str(eval(rand_expression)))

                media_paths = evaluate_and_replace_random(media_reference)

                for path in media_paths:
                    if any(keyword in path for keyword in keywords_to_exclude):
                        continue
                    absolute_path = os.path.join(image_directory, path)

                    # Check if the path is a directory
                    if os.path.isdir(absolute_path) and not os.listdir(absolute_path):
                        missing_media.append((os.path.basename(qsrc_file), path, line_number))

                    elif not os.path.exists(absolute_path):
                        missing_media.append((os.path.basename(qsrc_file), path, line_number))

# Specify the path to the "missing_media.txt" output file
missing_media_file = os.path.join(text_path, "missing_media.txt")

# Write the list of missing media with full media paths to the "missing_media.txt" file
with open(missing_media_file, "w", encoding="utf-8") as file:
    for qsrc_file, media_path, line_number in missing_media:
        file.write(f"From file: {qsrc_file}, line: {line_number}\n")  # Write the .qsrc filename and line number
        file.write(f"{media_path}\n\n")  # Write the full media path and start a new line
    file.write(f"\nTotal missing media files: {len(missing_media)}\n")  # Write the count of missing media files at the end of the file
    file.write(f"this amazing script was made by Awesome (with help from chatGPT)\n")  # Bragging

print(f"{len(missing_media)} Missing media files have been saved to 'missing_media.txt'.")
pause = input("Press Enter to exit.")

