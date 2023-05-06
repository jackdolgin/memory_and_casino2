#!/usr/bin/env python3
import pandas as pd
import os
import configparser
from argparse import ArgumentParser, ArgumentDefaultsHelpFormatter

def main(codeversion):
    qd = pd.read_csv(f'data/raw/{codeversion}/identifiers.csv')
    askforpermission = pd.read_csv(f'data/processed/{codeversion}/askforpermission.csv')
    qd = qd[qd['wid'].isin(askforpermission['wid'])]
    qd = qd[['bonus', 'worker_id']]
    qd = qd.rename(columns={'worker_id': 'participant_id'})
    qd = qd.set_index('participant_id')

    file = f'data/processed/{codeversion}/bonus.csv'
    qd.to_csv(file, index=True, header=False)
    # print(len(qd), 'participants to receive bonuses')
    # print(f'mean: ${qd.mean():.2f}  median: ${qd.median():.2f}')

    os.system(f'cat {file} | pbcopy')
    print(f'Wrote {file} and copied contents to clipboard.')

if __name__ == '__main__':
    parser = ArgumentParser(formatter_class=ArgumentDefaultsHelpFormatter)
    parser.add_argument(
        "version",
        nargs="?",
        help=("Experiment version. This corresponds to the experiment_code_version "
              "parameter in the psiTurk config.txt file that was used when the "
              "data was collected."))

    c = configparser.ConfigParser()
    c.read('config.txt')
    sp = c['Server Parameters']

    version = parser.parse_args().version
    if version == None:
        version = c["Task Parameters"]["experiment_code_version"]
        print("Creating bonus csv for current version: ", version)

    main(version)
