using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

public class Permitions
{

    public int Id { get; set; }
    public string Name { get; set; }
    public bool Enabled { get; set; }
    public string Development_Reference { get; set; }
}
