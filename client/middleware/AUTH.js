import cookie from 'cookie'
import Cookies from 'js-cookie';


export default function ({ store, redirect , req}) {
    // If the user is not authenticated
    if(store.state.auth == true){
        let token = cookie.parse(req.headers.cookie)
      if (token) {
            return redirect('/')
         }
    }
    
  }