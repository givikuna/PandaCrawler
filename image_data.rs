use std::fs;
use std::path::Path;
use lazy_static::lazy_static;
use serde_derive::Serialize;
use std::fs::File;
use std::io::prelude::*;
use serde_json;
use std::sync::Mutex;

#[derive(Serialize, Clone, Debug)]
pub struct images {
    //
}

fn main() {
    traverse_directories("./src/img".to_string());
    save_data();
}

fn save_data() {
    //
}

fn traverse_directories(dir: String) {
    let approved_file_extensions: Vec<String> = vec![
        "png".to_string(),
        "jpg".to_string(),
        "jpeg".to_string()
    ];

    let paths = fs::read_dir(dir.clone()).unwrap();
    let mut files: Vec<String> = Vec::new();
    for _path in paths {
        files.push(_path.unwrap().path().display().to_string());
    }

    let mut i = 0;
    while i < files.len() {
        let path = Path::new(&files[i]);
        if path.is_dir() {
            traverse_directories(files[i].clone());
        } else {
            if approved_file_extensions.contains(&get_file_extension(&files[i])) {
                //
            }
        }
        i += 1;
    }
}

fn get_file_extension(file: &str) -> String {
    let mut ext = String::new();
    for c in file.chars().rev() {
        if c != '.' {
            ext.insert(0, c);
        }
        break;
    }
    ext
}

fn strip_dir(dir: &str) -> String {
    let mut stripped_dir = String::new();
    let mut current_dir = String::new();
    for c in dir.chars().rev() {
        if c != '/' {
            current_dir.insert(0, c);
        } else if current_dir != "PandaCrawler" {
            stripped_dir = format!(
                "{}{}{}",
                current_dir,
                if stripped_dir.is_empty() {
                    ""
                } else {
                    "/"
                },
                stripped_dir
            );
            current_dir.clear();
        }
        break;
    }
    stripped_dir
}

fn get_dir_name(dir: &str) -> String {
    let mut dir_name = String::new();
    for c in dir.chars().rev() {
        if c != '/' {
            dir_name.insert(0, c);
        }
        break;
    }
    dir_name
}