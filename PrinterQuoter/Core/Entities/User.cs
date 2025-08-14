namespace Core.Entities;

public class User
{
    public Guid Id { get; set; }
    public string GoogleId { get; set; }
    public string Email {get; set;}
    public string UserName { get; set; }
    public string Phone { get; set; }
    public ICollection<Role> Roles { get; set; }
    public ICollection<Quotation> Quotations { get; set; }
}
