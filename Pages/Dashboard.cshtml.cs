using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Text.Json;

namespace IQAirClone.Pages   // ? cùng namespace v?i project g?c
{
    // =====================================================
    // LocationItem — model d? li?u m?t ??a ?i?m
    // =====================================================
    public class LocationItem
    {
        public string CityName { get; set; } = "";
        public string Province { get; set; } = "";
        public string Flag { get; set; } = "????";
        public int Aqi { get; set; }
        public string StatusText { get; set; } = "";
        public string StatusEmoji { get; set; } = "";
        public string StatusClass { get; set; } = "";
        public string Color { get; set; } = "";
        public double Pm25 { get; set; }
        public double Pm10 { get; set; }
        public double No2 { get; set; }
        public double O3 { get; set; }

        // Factory: t? xác ??nh màu + tr?ng thái t? AQI
        public static LocationItem From(
            string city, string province,
            int aqi, double pm25, double pm10, double no2, double o3)
        {
            var (text, emoji, cls, color) = aqi switch
            {
                <= 50 => ("T?t", "??", "db-good", "#2DC653"),
                <= 100 => ("Trung bình", "??", "db-moderate", "#F5A623"),
                <= 150 => ("Kém", "??", "db-sensitive", "#E8622A"),
                <= 200 => ("Có h?i", "??", "db-unhealthy", "#D93B3B"),
                _ => ("Nguy hi?m", "??", "db-very", "#8B3FBE"),
            };
            return new LocationItem
            {
                CityName = city,
                Province = province,
                Flag = "????",
                Aqi = aqi,
                StatusText = text,
                StatusEmoji = emoji,
                StatusClass = cls,
                Color = color,
                Pm25 = pm25,
                Pm10 = pm10,
                No2 = no2,
                O3 = o3,
            };
        }
    }

    // =====================================================
    // DashboardModel — Razor Page model
    // =====================================================
    public class DashboardModel : PageModel
    {
        public string UserName { get; private set; } = "Nguy?n Thanh";
        public List<LocationItem> Locations { get; private set; } = new();
        public string LocationsJson { get; private set; } = "[]";

        public void OnGet()
        {
            // =====================================================
            // D? LI?U M?U — 12 ??a ?i?m Vi?t Nam
            // Th? t?: Mi?n B?c ? Mi?n Trung ? Mi?n Nam
            // =====================================================
            Locations = new List<LocationItem>
            {
                // ---- MI?N B?C ----
                LocationItem.From("Hà N?i",           "Hà N?i",            87,  24.10, 48.30, 18.90, 41.20),
                LocationItem.From("H?i Phòng",        "H?i Phòng",         67,  17.40, 34.10, 14.20, 35.80),
                LocationItem.From("Nam ??nh",          "Nam ??nh",          52,  12.80, 28.50, 11.60, 30.40),
                LocationItem.From("Thái Nguyên",      "Thái Nguyên",       76,  20.30, 41.20, 16.70, 38.90),
                LocationItem.From("Qu?ng Ninh",       "Qu?ng Ninh",        95,  27.60, 55.40, 22.30, 44.10),

                // ---- MI?N TRUNG ----
                LocationItem.From("?à N?ng",          "?à N?ng",           42,   8.20, 14.10, 12.70, 31.40),
                LocationItem.From("Hu?",              "Th?a Thiên Hu?",    48,  10.10, 20.80, 13.40, 29.70),
                LocationItem.From("Vinh",             "Ngh? An",           63,  16.50, 32.80, 15.30, 36.20),
                LocationItem.From("?à L?t",           "Lâm ??ng",          28,   4.90,  9.20,  8.10, 22.60),

                // ---- MI?N NAM ----
                LocationItem.From("TP. H? Chí Minh", "TP. H? Chí Minh",  112,  38.20, 64.10, 52.30, 38.70),
                LocationItem.From("C?n Th?",          "C?n Th?",           44,   9.40, 18.20, 11.90, 27.30),
                LocationItem.From("Biên Hòa",         "??ng Nai",          99,  29.80, 58.60, 34.10, 42.80),
            };

            // Serialize cho JavaScript
            LocationsJson = JsonSerializer.Serialize(
                Locations.Select(l => new {
                    aqi = l.Aqi,
                    color = l.Color,
                }));
        }
    }
}
