#!/bin/bash

csv_file="data/raw/identifiers.csv"
workers_who_finished="data/raw/workers_who_finished.txt"

# Log file path
log_file="data/raw/send_bonuses.log"

# Remove the header line if you have one
tail -n +2 "$csv_file" > "temp_file.csv"

# Set IFS (Internal Field Separator) to a comma for CSV processing
IFS=','

# Add the date to the log file
date >> "$log_file"

# Read the CSV file line by line
while read -r wid worker_id assignment_id bonus; do
    # Check if the worker_id is present in the log_file
    if ! grep -q "$worker_id" "$log_file" && grep -q "$worker_id" "$workers_who_finished"; then
    # Do something with each cell

        echo "--worker-id $worker_id --bonus-amount $bonus --assignment-id $assignment_id --reason 'Performance bonus for the Introspection Study. Thank you for participating\!' --unique-request-token $assignment_id" >> "$log_file"

        # to use aws cli, you need to have aws cli installed and configured. Follow steps here https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html and https://psiturk.readthedocs.io/en/python2/configuration.html

        aws mturk send-bonus --worker-id $worker_id --bonus $bonus --assignment-id $assignment_id --reason "Performance bonus for the Introspection Study. Thank you for participating\!" --unique-request-token $assignment_id 2>> "$log_file"

    fi

done < "temp_file.csv"

# Remove the temporary file
rm "temp_file.csv"
