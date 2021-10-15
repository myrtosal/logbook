/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook.servlets;

import com.google.gson.Gson;
import static gr.csd.uoc.cs359.winter2019.logbook.ServletUtilities.filter;
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

/**
 *
 * @author Savvas
 */
public class get_user_info extends HttpServlet {

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
            User toreturn = UserDB.getUser(request.getParameter("username"));
            toreturn.setUserName(filter(toreturn.getUserName()));
            toreturn.setAddress(filter(toreturn.getAddress()));
            toreturn.setBirthDate(filter(toreturn.getBirthDate()));
            toreturn.setCountry(filter(toreturn.getCountry()));
            toreturn.setEmail(filter(toreturn.getEmail()));
            toreturn.setFirstName(filter(toreturn.getFirstName()));
            toreturn.setGender(filter(toreturn.getGender().toString()));
            toreturn.setInfo(filter(toreturn.getInfo()));
            toreturn.setInterests(filter(toreturn.getInterests()));
            toreturn.setLastName(filter(toreturn.getLastName()));
            toreturn.setOccupation(filter(toreturn.getOccupation()));
            toreturn.setPassword(filter(toreturn.getPassword()));
            toreturn.setTown(filter(toreturn.getTown()));
            String user_string = new Gson().toJson(toreturn);
            out.print(user_string);
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(get_user_info.class.getName()).log(Level.SEVERE, null, ex);
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
