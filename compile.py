import os
import subprocess

rust_files = [
    "build_files",
    "image_data"
]

for bin in rust_files:
    compile_command = 'cargo build --bin ' + bin
    subprocess.run(compile_command.split())
    move_command = 'mv ./target/debug/' + bin + ' ./'
    subprocess.run(move_command.split())