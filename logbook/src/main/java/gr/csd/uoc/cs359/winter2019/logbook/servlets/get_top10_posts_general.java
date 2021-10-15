/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package gr.csd.uoc.cs359.winter2019.logbook.servlets;

import static gr.csd.uoc.cs359.winter2019.logbook.ServletUtilities.filter;
import static gr.csd.uoc.cs359.winter2019.logbook.db.PostDB.getTop10RecentPosts;
import gr.csd.uoc.cs359.winter2019.logbook.model.Post;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
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
public class get_top10_posts_general extends HttpServlet {

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
            List<Post> posts = getTop10RecentPosts();
            int i = 0;
            for (Post post : posts) {
                out.println("<div class=\"post border rounded\" id=\"post" + i + "\">");
                out.println("<div class=\"post_top\" id=\"post_top" + i + "\">");
                out.println("<div class=\"d-flex post_deletion justify-content-between\">");
                out.println("<h5 onclick=\"javascript:show_other_user_info('" + post.getUserName() + "');\">" + filter(post.getUserName()) + "</h5>");
                out.println("<a href=\"javascript:view_detailed_post('" + post.getPostID() + "');\">View detailed post</a>");
                out.println("</div>");
                out.println("<div>");
                out.println("<span id=\"span" + i + "\">" + post.getCreatedAt() + "</span>");
                out.println("<span id=\"area_info_display" + i + "\"></span>");
                out.println("<span id=\"lat" + i + "\">" + filter(post.getLatitude()) + "</span>");
                out.println("<span id=\"lon" + i + "\">" + filter(post.getLongitude()) + "</span>");
                out.println("</div>");
                out.println("<p>" + filter(post.getDescription()) + "</p>");
                out.println("</div>");
                if (!post.getImageBase64().equals("") && post.getImageBase64() != null && !post.getImageBase64().equals("null")) {
                    out.println("<div class=\"image_area\" id=\"image_area" + i + "\">");
                    out.println("<img src=\"dasdasa\" hidden onerror=\"draw_camera_photo('" + post.getImageBase64() + "','" + "canvas" + i + "');\">");
                    // out.println("<canvas id=\"canvas" + i + "\"> </canvas>");
                    out.println("<div id=\"canvas" + i + "\"></div>");
                    out.println("</div>");
                } else if (!post.getImageURL().equals("") && post.getImageURL() != null && !post.getImageURL().equals("null")) {
                    out.println("<div class=\"image_area\" id=\"image_area" + i + "\">");
                    out.println("<img  src=\"" + filter(post.getImageURL()) + "\">");
                    out.println("</div>");
                }
                if (!post.getResourceURL().equals("")) {
                    out.println("<div class=\"external_links\" id=\"external_link" + i + "\">");
                    out.println("<p>Usefull link suggested by the user</p>");
                    out.println("<a href=\"" + filter(post.getResourceURL()) + "\">" + filter(post.getResourceURL()) + "</a>");
                    out.println("</div>");
                }
                out.println("<div class=\"post_bottom\">");
                out.println("<div>");
                out.println("<label>Rate this post");
                out.println("<select id=\"rate" + i + "\">");
                out.println("<option value=\"volvo\">1</option>");
                out.println("<option value=\"volvo\">2</option>");
                out.println("<option value=\"volvo\">3</option>");
                out.println("<option value=\"volvo\">4</option>");
                out.println("<option value=\"volvo\">5</option>");
                out.println("</select></label>");
                out.println("</div>");
                out.println("</div>");
                out.println("</div>");
                i++;
            }
        } catch (ClassNotFoundException ex) {
            Logger.getLogger(get_top10_posts_general.class.getName()).log(Level.SEVERE, null, ex);
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
