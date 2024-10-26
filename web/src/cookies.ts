import Cookies from 'js-cookie';

export function checkLogin() {
    const state = Cookies.get('attributecharacter');
    if (state == "chromeXI") {
        return true;
    } else {
        return false;
    }
}

export function removeLoginState() {
    Cookies.remove('attributecharacter');
}

export function setLoginFalse() {
    Cookies.set('attributecharacter', 'notFound', { expires: 79});
}

export function setLoginTrue() {
    Cookies.set('attributecharacter', 'chromeXI', { expires: 79});
}

export function setUsernameValue(username: string) {
    Cookies.set('attributedevname', username, { expires: 79 });
}
export function setPasswordValue(password: string) {
    Cookies.set('attributedevcode', password, { expires: 79 });
}

export function setPasswordZero() {
    Cookies.remove('attributedevcode');
}

export function setUsernameZero() {
    Cookies.remove('attributedevname');
}

export function getUsername() {
    return Cookies.get('attributedevname');
}

export function getPassword() {
    return Cookies.get('attributedevcode');
}