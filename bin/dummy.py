#!/usr/bin/env python3

import os
import subprocess
import logging
import requests
from requests.auth import HTTPBasicAuth
import pandas as pd
from argparse import ArgumentParser, ArgumentDefaultsHelpFormatter
import ast
import re
import json
from collections import defaultdict
import configparser

import hashlib
def hash_id(worker_id):
    if 'debug' in worker_id:
        return 'w' + hashlib.md5(worker_id.encode()).hexdigest()[:7]
    else:
        return 'REMOVE'
    
# qdf = pd.read_csv('/Users/jackdolgin/Dropbox/Mac (2)/Downloads/questiondata (2).csv', header=None)
# for uid, df in qdf.groupby(0):
# #     # # print("uid")
# #     # # print(uid)
# #     # # print("df")
# #     # # print(df)
# #     # # print(df.iloc[1, 2])
# #     # # bonus_row = df[df['B'] == 'bonus']
# #     # bonus_row = df[df.iloc[:, 1] == 'bonus']
# #     # # bonus_index = bonus_row.index[0]
# #     # # print(bonus_index)
# #     # # df.iloc[bonus_index, 2]
# #     # # # print(bonus_row.iloc[0, 2])
# #     # # bonus_amount = float(bonus_row.iloc[0, 2]) + 0.5
# #     # # if bonus_amount == 1:
# #     # #     print("1.00")
# #     # # elif bonus_amount == 0.75:
# #     # #     print("0.75")
# #     # # print(float(bonus_row.iloc[0, 2]) + 0.5)
# #     # for key, val in df.set_index(1)[2].items():
# #     #     print(key)

#     # for key, val in df.set_index(1)[2].items():
#     #     if key == 'bonus':
#     #         # row['completed'] = True
#     #         bonus_amt = float(val)
#     #         # row['bonus'] = bonus_amt
#     #         if bonus_amt == .25:
#     #             bonus_amt_str = '0.75'
#     #         elif bonus_amt == .5:
#     #             bonus_amt_str = '1.00'
#     #         # identifiers['bonus'].append(bonus_amt_str)
#     #         print(bonus_amt_str)

#     # print(df.set_index(1))
#     for key, val in df.set_index(1).items():
#         print(key)
#         print(val)
#         print(val[key])




# # qdf0 = pd.read_csv('/Users/jackdolgin/Dropbox/Stages_of_Life/Grad_School/Repos/gradual_resolution_of_uncertainty_one_shot_binary_choice2/data/raw/1.0/identifiers.csv')
# # qdf1 = pd.read_csv('/Users/jackdolgin/Dropbox/Stages_of_Life/Grad_School/Repos/gradual_resolution_of_uncertainty_one_shot_binary_choice2/data/raw/1.1/identifiers.csv')

# #             # old_idf = pd.read_csv(raw_identifiers_path, dtype={'bonus':'string'})
# #             # old_idf = old_idf.set_index('wid')            

# # qdf0 = qdf0.set_index('wid')
# # qdf1 = qdf1.set_index('wid')
# # combined_df = pd.concat([qdf0, qdf1])
# # print(combined_df)
# # # print(qdf0)
# # # print(qdf0.columns)

# # qdf2 = pd.read_csv('/Users/jackdolgin/Dropbox/Stages_of_Life/Grad_School/Repos/gradual_resolution_of_uncertainty_one_shot_binary_choice2/data/raw/identifiers.csv')




# tdf = pd.read_csv('/Users/jackdolgin/Dropbox/Stages_of_Life/Grad_School/Repos/gradual_resolution_of_uncertainty_one_shot_binary_choice2/data/raw/2.0/trialdata.csv', header=None)
# print(tdf)
# tdf = pd.DataFrame.from_records(tdf[3].apply(json.loads)).join(tdf[0])
# print('------')
# print(tdf)
# worker_ids = tdf[0].apply(lambda x: x.split(':')[0])
# tdf['wid'] = worker_ids.apply(hash_id)
# print(tdf)
# # return tdf.drop(0, axis=1)
# print('wid')
# # print()
# tdf.drop(0, axis=1)
# print(tdf)


qd = pd.read_csv('data/raw/2.0/identifiers.csv')
qd = qd[qd['wid'] != 'REMOVE']
qd = qd[['bonus', 'worker_id']]
qd = qd.rename(columns={'worker_id': 'participant_id'})
qd = qd.set_index('participant_id').bonus.round(2)
print(qd)