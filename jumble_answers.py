import json
import random

try:
    # Read the questions.json file
    with open('questions.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    total_jumbled = 0
    
    # Process each topic
    for topic, questions in data.items():
        for question in questions:
            try:
                # Get the correct answer
                correct_index = question.get('correct', 0)
                options = question.get('options', [])
                
                if correct_index >= len(options):
                    print(f"Warning: Skipping question with invalid correct index {correct_index} for {len(options)} options")
                    continue
                
                correct_answer = options[correct_index]
                
                # Shuffle the options
                shuffled_options = options.copy()
                random.shuffle(shuffled_options)
                
                # Find the new index of the correct answer
                new_correct_index = shuffled_options.index(correct_answer)
                
                # Update the question
                question['options'] = shuffled_options
                question['correct'] = new_correct_index
                total_jumbled += 1
                
            except Exception as e:
                print(f"Error processing question: {e}")
                continue

    # Write back to the file
    with open('questions.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"✓ Successfully jumbled {total_jumbled} questions!")
    
except Exception as e:
    print(f"Error: {e}")
