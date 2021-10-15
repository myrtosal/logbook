/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.regex.Pattern;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Savvas
 */
public class patterns_check extends HttpServlet {

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
        response.setContentType("text/html;charset=UTF-8");
        try (PrintWriter out = response.getWriter()) {
            /* TODO output your page here. You may use following sample code. */
            StringBuilder msg = new StringBuilder();
            Boolean error = false;

            msg.append("<b>Server response : please be sure that these fields are correct: ");
            if (!request.getParameter("username").matches("[a-zA-Z0-9]{8,}")) {
                msg.append("username ");
                error = true;
            }
            if (!request.getParameter("email").matches("([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+).([a-zA-Z]{2,5})")) {
                msg.append("email ");
                error = true;
            }
            if (!request.getParameter("first_name").matches("([a-zA-Z]|[α-ωΑ-Ω]){3,15}")) {
                msg.append("first_name ");
                error = true;
            }
            if (!request.getParameter("last_name").matches("([a-zA-Z]|[α-ωΑ-Ω]){3,15}")) {
                msg.append("last_name ");
                error = true;
            }
            if (!request.getParameter("city").matches("[a-zA-Zα-ωΑ-Ω]{2,20}")) {
                msg.append("city ");
                error = true;
            }
            if (!request.getParameter("job").matches("[a-zA-Zα-ωΑ-Ω]{3,15}")) {
                msg.append("job ");
                error = true;
            }
            msg.append("</b>");
            if (error) {
                out.print(msg);
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            } else {
                out.print("");
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
