using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Backend.Helpers.dal;
using Backend.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;

enum ExceptionCode
{
    NotPermitted = 51000
}

namespace Backend.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class RecordsController : ControllerBase
    {

        private readonly ILogger<RecordsController> _logger;

        public RecordsController(ILogger<RecordsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public string GetRecords([FromQuery(Name = "query")] string query, [FromQuery(Name = "from_date")] DateTime fromDate, [FromQuery(Name = "until_date")] DateTime untilDate)
        {
            
            DateTime initialDate = new DateTime(1, 1, 1, 0, 0, 0);
            if (DateTime.Compare(initialDate, fromDate) == 0) // if date not given, we initialize it to valid SQLServer dateime
            {
                fromDate = new DateTime(2000, 1, 1, 1, 1, 1);
            }

            if (DateTime.Compare(initialDate, untilDate) == 0) // if date not given, we initialize it to valid SQLServer dateime
            {
                untilDate = new DateTime(3000, 1, 1, 1, 1, 1);
            }

            return Dal.Instace.GetRecords(query, fromDate, untilDate);

        }

        [HttpPost]
        public IActionResult AddRecord(Record record)
        {   
            int userId = Int32.Parse(User.Identity.Name);
            try
            {
                Dal.Instace.AddRecord(userId, record.scheduledDate);
            }
            catch (SqlException exception)
            {
                if (exception.Number == (int)ExceptionCode.NotPermitted)
                {
                    return Unauthorized(exception.Message);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
            return new EmptyResult();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateRecord(int id, Record record)
        {
             
            int userId = Int32.Parse(User.Identity.Name);
            try
            {
                Dal.Instace.UpdateRecord(id, userId, record.scheduledDate);
            }
            catch (SqlException exception)
            {
                if (exception.Number == (int)ExceptionCode.NotPermitted)
                {
                    return Unauthorized(exception.Message);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
            return new EmptyResult();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteRecord(int id)
        {
            int userId = Int32.Parse(User.Identity.Name);
            try
            {
                Dal.Instace.DeleteRecord(userId, id);
            }
            catch (Exception exception)
            {
                if (exception is SqlException)
                {
                    if ((exception as SqlException).Number == (int)ExceptionCode.NotPermitted)
                    {
                        return Unauthorized(exception.Message);
                    } else
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError);
                    }
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError);
                }
            }
            return new EmptyResult();
        }
    }
}
