/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook.servlets;

import com.google.gson.Gson;
import static gr.csd.uoc.cs359.winter2019.logbook.Cookie_handling.getCookieValue;
import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import gr.csd.uoc.cs359.winter2019.logbook.model.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONObject;

/**
 *
 * @author Savvas
 */
public class resolve_content extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     * @throws java.lang.ClassNotFoundException
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException, ClassNotFoundException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            String sessionID = getCookieValue(request, "persistent_test");
            //System.out.println(sessionID);
            //if (sessionID.equals("no_cookie") && request.getSession(false) == null) {
            if (request.getSession(false) == null) {
                String msg = "fresh_user";
                String result = new JSONObject()
                        .put("result", msg)
                        .toString();
                out.print(result);
            } else {
                String username;

                /*for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals("JSESSIONID")) {
                        cookie.setMaxAge(0);
                        response.addCookie(cookie);
                    }
                }*/

                //if (!getCookieValue(request, "persistent_test").equals("no_cookie")) {
                //    username = getCookieValue(request, "testing");
                //} else {
                username = (String) request.getSession(false).getAttribute("username");
                request.getSession().setMaxInactiveInterval(-1);
                //}
                //HttpSession session = request.getSession(true);
                //if (session.getAttribute("username") == null) {
                //    session.setAttribute("username", username);
                //    session.setMaxInactiveInterval(-1);
                //}
                User toreturn = UserDB.getUser(username);
                String user_string = new Gson().toJson(toreturn);
                String result = new JSONObject().put("result", "signed_in").put("user", user_string).toString();
                out.print(result);
            }
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(resolve_content.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        try {
            processRequest(request, response);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(resolve_content.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
