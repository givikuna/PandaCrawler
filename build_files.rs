use lazy_static::lazy_static;
use serde_derive::Serialize;
use serde_json;
use std::fs;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use std::sync::Mutex;

#[derive(Serialize, Clone, Debug)]
pub struct Files {
    type_: String,
    files: Vec<FileStruct>,
}

#[derive(Debug, Serialize, Clone)]
pub struct FileStruct {
    dir: String,
    file: String,
}

lazy_static! {
    static ref FILES_DATA: Mutex<Vec<Files>> = Mutex::new(vec![
        Files {
            type_: String::from("rs"),
            files: vec![],
        },
        Files {
            type_: String::from("js"),
            files: vec![],
        },
        Files {
            type_: String::from("css"),
            files: vec![],
        },
        Files {
            type_: String::from("py"),
            files: vec![],
        },
    ]);
}

fn main() {
    traverse_directories("./".to_string());
    write_data();
}

fn write_data() {
    let file_path: &str = "./files.json";
    let serialized_json: Vec<u8> = serde_json::to_vec(&FILES_DATA.lock().unwrap().clone()).unwrap();
    let mut json_file: File = File::create(file_path).expect("Failed to create file");
    json_file
        .write_all(&serialized_json)
        .expect("Failed to write to file");
}

fn traverse_directories(dir: String) {
    let do_not_enter: Vec<String> = vec![
        ".vscode".to_string(),
        "node_modules".to_string(),
        "target".to_string(),
        ".git".to_string(),
    ];

    let approved_file_extensions: Vec<String> =
        vec!["rs".to_string(), "js".to_string(), "css".to_string()];

    let paths: fs::ReadDir = fs::read_dir(dir.clone()).unwrap();
    let mut _files: Vec<String> = Vec::new();
    for path in paths {
        _files.push(path.unwrap().path().display().to_string());
    }

    let mut i: usize = 0;
    while i < _files.len() {
        let path: &Path = Path::new(&_files[i]);
        if path.is_dir() {
            if !do_not_enter.contains(&get_dir_name(&_files[i])) {
                traverse_directories(_files[i].clone());
            }
        } else {
            if approved_file_extensions.contains(&get_file_extension(&_files[i])) {
                let mut j: usize = 0;
                while &j < &FILES_DATA.lock().unwrap().len() {
                    let mut files_data: std::sync::MutexGuard<'_, Vec<Files>> =
                        FILES_DATA.lock().unwrap();
                    let current_ext: &String = &files_data[j].type_;
                    if current_ext == &get_file_extension(&_files[i]) {
                        let _file: Vec<FileStruct> = vec![FileStruct {
                            dir: "./".to_owned() + strip_dir(&_files[i]).as_str(),
                            file: _files[i].clone(),
                        }];
                        // smthn causes this to hang, happens for anyithing involving FILES_DATA.lock()
                        let _ = &files_data[j].files.push(_file[0].clone());
                    }

                    j += 1;
                }
            }
        }
        i += 1;
    }
}

fn get_file_extension(file: &str) -> String {
    let mut ext: String = String::new();
    for c in file.chars().rev() {
        if c != '.' {
            ext.insert(0, c);
        } else {
            break;
        }
    }
    ext
}

fn strip_dir(dir: &str) -> String {
    // ./src/components/homePageSearchBar/src.css
    let mut stripped_dir: String = String::new();
    let mut current_dir: String = String::new();
    for c in dir.chars() {
        if c != '/' {
            current_dir += c.to_string().as_str();
            if c == '.' {
                current_dir.clear();
            }
        } else {
            if current_dir.contains('.') {
                break;
            } else {
                stripped_dir = format!(
                    "{}{}{}",
                    current_dir,
                    if stripped_dir.is_empty() { "" } else { "/" },
                    stripped_dir
                );
                current_dir.clear();
            }
        }
    }
    stripped_dir
}

fn get_dir_name(dir: &str) -> String {
    let mut dir_name: String = String::new();
    for c in dir.chars().rev() {
        if c != '/' {
            dir_name.insert(0, c);
        } else {
            break;
        }
    }
    dir_name
}
