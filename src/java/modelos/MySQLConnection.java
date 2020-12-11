/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package modelos;

/**
 *
 * @author OzKuro
 */

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.DriverManager;
        
        
public class MySQLConnection {
    	//Un objeto connection es el contexto donde se ejecutan las sentencias SQL y se devuelven los resultados
	Connection con;		//Se declara y se inicializa con NULL

	//Driver manager es la clase que implementa a la interface Connection y el método getConnection() obtiene una conexión hacia el servidor y base de datos
	//proporcionados como argumentos para su parametros String



	public static void main (String args[])
	{
		new MySQLConnection();
		
	}


	public MySQLConnection()
	{
		System.out.println("HOLA");
		try
		{
			Class.forName("com.mysql.cj.jdbc.Driver");

			con = DriverManager.getConnection("jdbc:mysql://localhost/prueba?useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=UTC&autoReconnect=true&useSSL=false&"+"user=root&password=admin");
			
			if(con != null)
				System.out.println("Success connection");
			else
				System.out.println("Error, Something went wrong");
		}

		catch(ClassNotFoundException cnfe)
		{
			System.out.println("Error, revise el driver");
		}

		catch(SQLException sqle)
		{
			System.out.println("Error, revise la base de datos" + sqle.getMessage());
		}

	}

	public Connection getConexion()
	{
		return con;
	}
}
