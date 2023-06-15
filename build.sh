npm install
curl --proto '=https' --tlsv1.3 https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
cargo build
# touch files.json
python3 compile.py
./build_files
./image_data