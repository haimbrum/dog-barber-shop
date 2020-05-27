using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Data.SqlClient;
using Backend.Entities;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;



namespace Backend.Helpers.dal
{
    public class Dal
    {
        private static Dal _instance;
        private string _connectionString; 

        private Dal() { }

        public static Dal Instace
        {
            get
            {
                if (_instance == null)
                {
                    _instance = new Dal();
                }

                return _instance;
            }
        }

        public void Init(string connectionString)
        {
            _connectionString = connectionString;
        }
        public string GetRecords(string query, DateTime fromDate, DateTime untilDate)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                
                using (SqlCommand cmd = new SqlCommand("GetAllRecords",connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add("@query", System.Data.SqlDbType.NVarChar).Value = query;
                    cmd.Parameters.Add("@from_date", System.Data.SqlDbType.DateTime).Value = fromDate;
                    cmd.Parameters.Add("@until_date", System.Data.SqlDbType.DateTime).Value = untilDate;
                    var result = cmd.ExecuteScalar().ToString();
                    return result;
                }
            }
        }

        public void AddRecord(int userId, DateTime scheduledDate)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("AddNewRecord", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add("@user_id", System.Data.SqlDbType.Int).Value = userId;
                    cmd.Parameters.Add("@schedule_date", System.Data.SqlDbType.DateTime).Value = scheduledDate;
                    cmd.ExecuteNonQuery();
                }
            }
        }

        public void UpdateRecord(int recordId, int userId, DateTime scheduledDate)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("UpdateRecord", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add("@recordId", System.Data.SqlDbType.Int).Value = recordId;
                    cmd.Parameters.Add("@user_id", System.Data.SqlDbType.Int).Value = userId;
                    cmd.Parameters.Add("@schedule_date", System.Data.SqlDbType.DateTime).Value = scheduledDate;
                    cmd.ExecuteNonQuery();
                }
            }   
        }

         public void DeleteRecord(int userId, int recordId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("DeleteRecord", connection))
                {
                         cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add("@recordId", System.Data.SqlDbType.Int).Value = recordId;
                        cmd.Parameters.Add("@userId", System.Data.SqlDbType.Int).Value = userId;
                        cmd.ExecuteNonQuery();                        
                }
            }
        }

        public List<User> GetAllUsers()
        {
            List<User> result = new List<User>();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                string queryString = "SELECT id, username, password FROM users";
                using (SqlCommand cmd = new SqlCommand(queryString, connection))
                {
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            result.Add(new User { Id = (int)reader[0], Username = reader[1].ToString(), Password = reader[2].ToString() });
                        }

                        return result;
                    }
                }
            }
        }

        public User AddUser(string username, string password)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                using (SqlCommand cmd = new SqlCommand("AddNewUser", connection))
                {
                    cmd.CommandType = System.Data.CommandType.StoredProcedure;
                    cmd.Parameters.Add("@username", System.Data.SqlDbType.NVarChar).Value = username;
                    cmd.Parameters.Add("@password", System.Data.SqlDbType.NVarChar).Value = password;
                    var result = cmd.ExecuteScalar().ToString();
                    var newUserId = Int32.Parse(result);

                    return new User { Id = newUserId, Username = username, Password = password };
                }
            }
        }

    }
}