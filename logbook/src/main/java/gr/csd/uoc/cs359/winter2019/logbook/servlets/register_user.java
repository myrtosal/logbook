/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook.servlets;

import com.google.gson.Gson;
import static gr.csd.uoc.cs359.winter2019.logbook.ServletUtilities.filter;
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

/**
 *
 * @author Savvas
 */
public class register_user extends HttpServlet {

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

            HttpSession session = request.getSession(true);
            session.setAttribute("username", request.getParameter("username"));
            session.setMaxInactiveInterval(-1);//arnhtiko shmainei never invalidate
            /*before setting the user filter his fields to be xss safe*/
 /*do the same when create the get users function before responding data*/
            User user = new User();
            user.setUserName(filter(request.getParameter("username")));
            user.setEmail(filter(request.getParameter("email")));
            user.setPassword(getMd5(filter(request.getParameter("password"))));
            user.setFirstName(filter(request.getParameter("first_name")));
            user.setLastName(filter(request.getParameter("last_name")));
            user.setBirthDate(filter(request.getParameter("bday")));
            user.setGender(filter(request.getParameter("genders")));
            user.setCountry(filter(request.getParameter("country")));
            user.setTown(filter(request.getParameter("city")));
            user.setAddress(filter(request.getParameter("address")));
            user.setOccupation(filter(request.getParameter("job")));
            user.setInterests(filter(request.getParameter("interests")));
            user.setInfo(filter(request.getParameter("general_info")));
            if (UserDB.checkValidUserName(user.getUserName()) && UserDB.checkValidEmail(user.getEmail())) {
                UserDB.addUser(user);
            }
            User toreturn = UserDB.getUser(user.getUserName());
            String user_string = new Gson().toJson(toreturn);
            out.print(user_string);

        } catch (ClassNotFoundException ex) {
            Logger.getLogger(register_user.class.getName()).log(Level.SEVERE, null, ex);
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
