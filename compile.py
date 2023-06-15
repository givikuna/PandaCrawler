import os
import subprocess
import json

subprocess.run('cargo run --build build_files'.split())

rust_files = []

data = json.load(open('./files.json'))

for d in data:
    if d["type_"] == "rs":
        for f in d["files"]:
            rust_files.append(f["file"])

for bin_ in rust_files:
    compile_command = 'cargo build --bin ' + bin_
    subprocess.run(compile_command.split())
    move_command = 'mv ./target/debug/' + bin_ + ' ./'
    subprocess.run(move_command.split())
