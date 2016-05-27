#!/usr/bin/python

import sys
import csv
import json


def main(argv):
	csv_filename = argv[0]
	rows = []
	with open(csv_filename, mode = 'rU') as infile:
		reader = csv.reader(infile)
		rownum = 0
		for row in reader:
			if rownum == 0:
				header = row
			else:
				colnum = 0
				row_dict = {}
				for col in row:
					row_dict[header[colnum]] = col
					colnum += 1
				rows.append(row_dict)
			rownum += 1

	json_filename = csv_filename.replace('.csv', '_json.txt')
	with open(json_filename, 'w+') as outfile:
		json.dump(rows, outfile)

	# with open('coors_new.csv', mode='w') as outfile:
	#	writer = csv.writer(outfile)
	#	mydict = {rows[0]:rows[1] for rows in reader}


if __name__ == "__main__":
	main(sys.argv[1:])