import os
import subprocess
import json

subprocess.run('cargo run --bin build_files'.split())

rust_files = []

data = json.load(open('./files.json'))

def remove_ext(given):
    w_out_ext = ""
    for c in given:
        if c == '.':
            break
        else:
            w_out_ext += c
    return w_out_ext

for d in data:
    if d["type_"] == "rs":
        for f in d["files"]:
            rust_files.append(f["file"])

for bin_ in rust_files:
    compile_command = 'cargo build --bin ' + remove_ext(bin_)
    subprocess.run(compile_command.split())
    move_command = 'mv ./target/debug/' + remove_ext(bin_) + ' ./'
    subprocess.run(move_command.split())
