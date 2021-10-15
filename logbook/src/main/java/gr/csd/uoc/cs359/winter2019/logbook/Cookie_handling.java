/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

/**
 *
 * @author Savvas
 */
public class Cookie_handling {
    public static String getCookieValue(HttpServletRequest request,
            String cookieName
    ) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    System.out.println(cookie.getName());
                    return cookie.getValue();
                }
            }
        }
        return "no_cookie";
    }
}
