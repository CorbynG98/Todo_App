using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dotnet_todo_api.core.Exceptions
{
    public class TodoException(string message) : Exception(message)
    {
    }
}
