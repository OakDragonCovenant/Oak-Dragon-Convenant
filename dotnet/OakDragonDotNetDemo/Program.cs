using System;
using Newtonsoft.Json;

namespace OakDragonDotNetDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            var obj = new { Message = "Hello from .NET!", Date = DateTime.UtcNow };
            string json = JsonConvert.SerializeObject(obj, Formatting.Indented);
            Console.WriteLine(json);
        }
    }
}
