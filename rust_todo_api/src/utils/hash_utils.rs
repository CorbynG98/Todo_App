use sha2::{Sha512, Digest};

pub fn compute_sha512(input: &str) -> String {
    let mut hasher = Sha512::new();
    hasher.update(input.as_bytes());
    let hashed_string: Vec<u8> = hasher.finalize().into_iter().collect();
    return hex::encode(hashed_string);
}