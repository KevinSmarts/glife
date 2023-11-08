import os
import re

#made by Awesome :peeposhrug:

script_directory = os.path.dirname(os.path.realpath(__file__))
text_path = os.path.dirname(script_directory)
qsrc_directory = os.path.join(text_path, 'locations')
image_directory = input('Enter the game directory: ')
keywords = input('Enter keywords to exclude (comma-separated, press Enter to skip): ')

keywords_to_exclude = keywords.split(',')

# Create a list to store missing images
missing_images = []
color_values = ['black', 'brown', 'red', 'blonde', 'light red', 'dark blue', 'blue', 'light blue', 'dark green', 'green', 'light green', 'dark pink', 'pink', 'light pink', 'dark purple', 'purple', 'light purple', 'light orange', 'dark red', 'medium red', 'turquoise', 'medium orange', 'dark orange']

def exclude_keywords(image_path, keywords):
    for keyword in keywords:
        if keyword and keyword.lower() in image_path.lower():
            return True
    return False

keywords_to_exclude.append('$pcs_haircol')
keywords_to_exclude.append('set_<<')
keywords_to_exclude.append('+iif')
keywords_to_exclude.append('<<FUNC')

# Function to construct the absolute path from a relative image reference
def construct_absolute_path(image_reference, image_directory):
    return os.path.join(image_directory, image_reference.replace("images\\", ""))

# Function to evaluate and replace random expressions within a string
def evaluate_and_replace_random(expression):
    image_paths = []

    # Define a regular expression pattern to find '+rand(...)' or '<<rand(...)>>' expressions
    rand_pattern = r'(\+\s*rand\(([^)]*)\)\s*\+|\s*<<rand\(([^)]*)\)>>)'

    # Find all matching expressions in the input string
    matches = re.finditer(rand_pattern, expression)

    # Initialize the modified expression
    modified_expression = expression

    # Iterate through the matches and replace them
    for match in matches:
        rand_expression = match.group(2) or match.group(3)
        if rand_expression:
            # Check if there are numeric values within the parentheses
            numeric_values = re.findall(r'\d+', rand_expression)
            if numeric_values:
                min_value = int(numeric_values[0])
                max_value = int(numeric_values[1]) if len(numeric_values) > 1 else min_value
                if min_value <= max_value:
                    # Generate image paths for each number in the range
                    image_paths.extend([str(num) for num in range(min_value, max_value + 1)])

        # Replace the match in the expression with a placeholder
        modified_expression = modified_expression.replace(match.group(0), '<REPLACED>')

    # Remove single quotes and extra spaces
    modified_expression = modified_expression.replace("'", "").strip()
    modified_expression = modified_expression.replace(" ", "")

    # Add the generated image paths to the result
    image_paths = [modified_expression.replace('<REPLACED>', str(num)) for num in image_paths]

    return image_paths

# Function to evaluate and replace variables within a string
def evaluate_and_replace_variables(expression, variables):
    variable_matches = re.findall(r'<<(\$?[a-zA-Z_][a-zAZ0-9_]*)>>', expression)
    for variable_name in variable_matches:
        if variable_name.startswith("$"):
            variable_value = variables.get(variable_name[1:], "")
        else:
            variable_value = variables.get(variable_name, "")
        expression = expression.replace(f"<<{variable_name}>>", str(variable_value))
    return [expression]

# Iterate through .qsrc files in the specified directory and its subdirectories
for root, dirs, files in os.walk(qsrc_directory):
    for file in files:
        if file.endswith(".qsrc"):
            qsrc_file = os.path.join(root, file)

            # Read the .qsrc file
            with open(qsrc_file, "r", encoding="utf-8") as script_file:
                script_content = script_file.readlines()

            # Find and extract variable assignments within the same code block
            variable_matches = re.findall(r'<<(\$?[a-zA-Z_][a-zAZ0-9_]*)>>\s*=\s*([\'"]?[^\'"]+[\'"]?)', ''.join(script_content))

            # Store variable values for this code block
            code_block_variables = {}
            for variable_name, variable_value in variable_matches:
                code_block_variables[variable_name] = variable_value.strip("'\"")

            # Use regular expressions to find image references in the script
            for line_number, line in enumerate(script_content, start=1):
                if line.strip().startswith('!') or '+iif' in line or '<<FUNC' in line:
                    continue
                image_references = re.findall(r'<(?:img <<\$set_imgh>>|video autoplay loop) src="([^"]+)"', line)

                for image_reference in image_references:
                    if exclude_keywords(image_reference, keywords_to_exclude):
                        continue
                    # If the image reference contains '<<$pcs_haircol>>', replace it with each color value
                    if '<<$pcs_haircol>>' in image_reference:
                        for color in color_values:
                            # Replace spaces with underscores in color names
                            image_reference_color = image_reference.replace('<<$pcs_haircol>>', color)
                            # Handle the '+rand(1,19)+' part
                            if '+rand(1,19)+' in image_reference_color:
                                for i in range(1, 20):  # 20 is exclusive, so this will give numbers from 1 to 19
                                    image_reference_color_i = image_reference_color.replace('+rand(1,19)+', str(i))
                                    # Remove single quotes around the number
                                    image_reference_color_i = image_reference_color_i.replace("'"+str(i)+"'", str(i))
                                    absolute_path = construct_absolute_path(image_reference_color_i, image_directory)
                                    
                                    if not os.path.exists(absolute_path):
                                        
                                        missing_images.append((os.path.basename(qsrc_file), image_reference_color_i, line_number))  # Store the .qsrc filename, image path, and line number
                            else:
                                absolute_path = construct_absolute_path(image_reference_color, image_directory)
                                
                                if not os.path.exists(absolute_path):
                                    
                                    missing_images.append((os.path.basename(qsrc_file), image_reference_color, line_number))  # Store the .qsrc filename, image path, and line number
                    else:
                        # Evaluate variables first
                        image_reference = evaluate_and_replace_variables(image_reference, code_block_variables)[0]
                        image_paths = evaluate_and_replace_random(image_reference)

                        for path in image_paths:
                            if exclude_keywords(path, keywords_to_exclude):
                                continue
                            absolute_path = construct_absolute_path(path, image_directory)
                            
                            if not os.path.exists(absolute_path):
                                
                                missing_images.append((os.path.basename(qsrc_file), path, line_number))  # Store the .qsrc filename, image path, and line number
missing_media_count = len(missing_images)

# Specify the path to the "missing_media.txt" output file
missing_media_file = os.path.join(text_path, "missing_media.txt")

# Write the list of missing images with full image paths to the "missing_media.txt" file
with open(missing_media_file, "w", encoding="utf-8") as file:
    for qsrc_file, image_path, line_number in missing_images:
        file.write(f"From file: {qsrc_file}, line: {line_number}\n")  # Write the .qsrc filename and line number
        file.write(f"images/{image_path.replace('images/', '')}\n\n")  # Write the relative image path and start a new line
    file.write(f"\nTotal missing media files: {missing_media_count}\n")  # Write the count of missing media files at the end of the file
    file.write(f"this amazing script was made by Awesome(with help from chatGPT)\n") #bragging
print(f"{missing_media_count} Missing images have been saved to 'missing_media.txt'.")
pause = input("Press Enter to exit.")