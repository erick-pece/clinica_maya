/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelos;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 *
 * @author OzKuro
 */
public class LoginDAO {
    Connection con;
    
    public LoginDAO(){
    MySQLConnection msc = new MySQLConnection();
    con = msc.getConexion();
    }
    
    public boolean read(String usuario, String pswd){
        boolean existe = false;
        
        try{
            String sqlSelect = "select * from table_Usuarios where usuario='" + usuario +"' and pswd= " + "'" + pswd + "';";
            Statement stmt = con.createStatement();
            System.out.println(sqlSelect);
            ResultSet rs = stmt.executeQuery(sqlSelect);
            
            if(rs.next()==true){
                System.out.println("User exists");
                existe = true;
            }
            else{
                System.out.println("User DON´T exists");
            }
        }
        catch(SQLException sql){
            System.out.println("Error de sql" + sql.getMessage());
        }
        
        return existe;
    }
}
