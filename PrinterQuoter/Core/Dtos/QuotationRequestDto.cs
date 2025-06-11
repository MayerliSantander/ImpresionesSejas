namespace Core.Dtos;

public class QuotationRequestDto
{
    public string Phone { get; set; }
    public List<QuotationProductDto> Bag { get; set; }
}
