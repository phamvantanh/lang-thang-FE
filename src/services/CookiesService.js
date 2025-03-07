import Cookies from 'js-cookie'
import React from 'react'


const CookiesService = (function(){
    var _service

    function _getService() {
        if(!_service) {
          _service = this;
          return _service
      }
      return _service
    }
    function _setToken(token) {
      Cookies.set("token", token)
    }

    function _getToken() {
      return Cookies.get("token");
    }
    function _clearToken() {
      Cookies.remove("token")
    }
   return {
      getService : _getService,
      setToken : _setToken,
      getToken: _getToken,
      clearToken : _clearToken
    }
   })();
   export default CookiesService;