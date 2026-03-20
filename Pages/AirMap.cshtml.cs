using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace IQAirClone.Pages
// LocationItem đã được định nghĩa trong Dashboard.cshtml.cs
// KHÔNG khai báo lại ở đây để tránh lỗi trùng class
{
    public class AirMapModel : PageModel
    {
        public List<LocationItem> Locations { get; private set; } = new();
        public string LocationsJson { get; private set; } = "[]";

        public void OnGet()
        {
            Locations = new List<LocationItem>
            {
                LocationItem.From("Hà Nội",           "Hà Nội",            87,  24.10, 48.30, 18.90, 41.20),
                LocationItem.From("Hải Phòng",        "Hải Phòng",         67,  17.40, 34.10, 14.20, 35.80),
                LocationItem.From("Nam Định",         "Nam Định",          52,  12.80, 28.50, 11.60, 30.40),
                LocationItem.From("Thái Nguyên",      "Thái Nguyên",       76,  20.30, 41.20, 16.70, 38.90),
                LocationItem.From("Quảng Ninh",       "Quảng Ninh",        95,  27.60, 55.40, 22.30, 44.10),
                LocationItem.From("Đà Nẵng",          "Đà Nẵng",           42,   8.20, 14.10, 12.70, 31.40),
                LocationItem.From("Huế",              "Thừa Thiên Huế",    48,  10.10, 20.80, 13.40, 29.70),
                LocationItem.From("Vinh",             "Nghệ An",           63,  16.50, 32.80, 15.30, 36.20),
                LocationItem.From("Đà Lạt",           "Lâm Đồng",          28,   4.90,  9.20,  8.10, 22.60),
                LocationItem.From("TP. Hồ Chí Minh", "TP. Hồ Chí Minh",  112,  38.20, 64.10, 52.30, 38.70),
                LocationItem.From("Cần Thơ",          "Cần Thơ",           44,   9.40, 18.20, 11.90, 27.30),
                LocationItem.From("Biên Hòa",         "Đồng Nai",          99,  29.80, 58.60, 34.10, 42.80),
            };

            LocationsJson = JsonSerializer.Serialize(
                Locations.Select(l => new {
                    city = l.CityName,
                    province = l.Province,
                    aqi = l.Aqi,
                    color = l.Color,
                    emoji = l.StatusEmoji,
                    status = l.StatusText,
                    pm25 = l.Pm25,
                    pm10 = l.Pm10,
                    no2 = l.No2,
                    o3 = l.O3,
                }));
        }
    }
}
