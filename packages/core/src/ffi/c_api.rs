// C-compatible API for Node.js FFI
// These functions use C calling conventions and can be called from Node.js

use std::ffi::CString;
use std::os::raw::c_char;

/// Initialize the library
/// Returns 0 on success, -1 on error
#[no_mangle]
pub extern "C" fn voice_pa_init() -> i32 {
    env_logger::try_init().ok();
    log::info!("Voice PA Core initialized");
    0
}

/// Get library version
#[no_mangle]
pub extern "C" fn voice_pa_version() -> *const c_char {
    let version = CString::new(env!("CARGO_PKG_VERSION")).unwrap();
    version.into_raw()
}

/// Free a string allocated by the library
#[no_mangle]
pub extern "C" fn voice_pa_free_string(s: *mut c_char) {
    if !s.is_null() {
        unsafe {
            let _ = CString::from_raw(s);
        }
    }
}

// Note: For a production C API, we would need to expose more functions
// and handle state management carefully. This is a minimal example.

#[cfg(test)]
mod tests {
    use super::*;
    use std::ffi::CStr;

    #[test]
    fn test_c_api_init() {
        let result = voice_pa_init();
        assert_eq!(result, 0);
    }

    #[test]
    fn test_c_api_version() {
        let version_ptr = voice_pa_version();
        assert!(!version_ptr.is_null());
        
        unsafe {
            let c_str = CStr::from_ptr(version_ptr);
            let version = c_str.to_str().unwrap();
            assert!(!version.is_empty());
        }
    }
}
