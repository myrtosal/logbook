/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook.servlets;

import com.google.gson.Gson;
import gr.csd.uoc.cs359.winter2019.logbook.db.UserDB;
import static gr.csd.uoc.cs359.winter2019.logbook.encryption_handling.getMd5;
import gr.csd.uoc.cs359.winter2019.logbook.model.User;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.json.JSONObject;
/**
 *
 * @author Savvas
 */
public class sign_in_user extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            if (UserDB.checkValidUserName(request.getParameter("username"))) {
                String msg = "username_not_existant";
                String result = new JSONObject()
                        .put("result", msg)
                        .toString();
                out.print(result);
            } else if (UserDB.getUser(request.getParameter("username")).getPassword().equals(getMd5(request.getParameter("password")))) {
                /*he gave correct password*/
                HttpSession session = request.getSession(true);
                if (session.getAttribute("username") == null) {
                    session.setAttribute("username", request.getParameter("username"));
                    
                }
                session.setMaxInactiveInterval(-1);
                System.out.println((request.getParameter("username_enrypted")));
                System.out.println(getMd5(request.getParameter("username_enrypted")));
                User toreturn = UserDB.getUser(request.getParameter("username"));
                String user_string = new Gson().toJson(toreturn);
                //Random rand = new Random();
                //Cookie persistent = new Cookie("persistent_test", request.getParameter("username"));
                //persistent.setMaxAge(120);
                // response.addCookie(persistent);

                /* Cookie cookie = new Cookie("JSESSIONID", session.getId());
                cookie.setMaxAge(30);
                response.addCookie(cookie);
                response.setContentType("text/html;charset=UTF-8");
                System.out.println(session.isNew());*/

                out.print(user_string);
            } else {
                String msg = "wrong_password";
                String result = new JSONObject()
                        .put("result", msg)
                        .toString();
                out.print(result);
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(sign_in_user.class.getName()).log(Level.SEVERE, null, ex);
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
        processRequest(request, response);
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
        processRequest(request, response);
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
