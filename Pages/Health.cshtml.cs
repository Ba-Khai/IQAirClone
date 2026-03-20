using Microsoft.AspNetCore.Mvc.RazorPages;

namespace IQAirClone.Pages
// LocationItem đã được định nghĩa trong Dashboard.cshtml.cs
// KHÔNG khai báo lại ở đây
{
    public class HealthGroup
    {
        public string Icon { get; set; } = "";
        public string Name { get; set; } = "";
        public string RiskLevel { get; set; } = "";
        public string CssClass { get; set; } = "";
        public string BadgeColor { get; set; } = "";
        public string BadgeText { get; set; } = "#fff";
        public string BadgeLabel { get; set; } = "";
        public List<string> Tips { get; set; } = new();
    }

    public class HealthIndex
    {
        public string Icon { get; set; } = "";
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public int Percent { get; set; }
        public string Value { get; set; } = "";
        public string Color { get; set; } = "";
    }

    public class MaskItem
    {
        public string Name { get; set; } = "";
        public string Efficiency { get; set; } = "";
        public bool Recommended { get; set; }
    }

    public class HealthModel : PageModel
    {
        public List<HealthGroup> HealthGroups { get; private set; } = new();
        public List<HealthIndex> HealthIndexes { get; private set; } = new();
        public List<MaskItem> MaskAdvice { get; private set; } = new();
        public List<string> DoList { get; private set; } = new();
        public List<string> DontList { get; private set; } = new();

        public void OnGet()
        {
            HealthGroups = new List<HealthGroup>
            {
                new HealthGroup {
                    Icon="👶", Name="Trẻ em & Trẻ sơ sinh",
                    RiskLevel="Nhóm rất nhạy cảm", CssClass="hg-danger",
                    BadgeColor="#D93B3B", BadgeLabel="Nguy cơ cao",
                    Tips=new(){"Hạn chế cho trẻ ra ngoài khi AQI > 100","Đóng cửa sổ, dùng máy lọc không khí","Không để trẻ chơi gần đường phố đông xe","Theo dõi triệu chứng ho, khó thở"}
                },
                new HealthGroup {
                    Icon="🤰", Name="Phụ nữ mang thai",
                    RiskLevel="Nhóm nhạy cảm", CssClass="hg-warning",
                    BadgeColor="#E8622A", BadgeLabel="Cần chú ý",
                    Tips=new(){"Đeo khẩu trang N95 khi AQI > 75","Tránh tập thể dục ngoài trời khi không khí kém","Uống nhiều nước, bổ sung vitamin C","Khám ngay nếu có triệu chứng bất thường"}
                },
                new HealthGroup {
                    Icon="🫁", Name="Người có bệnh hô hấp",
                    RiskLevel="Hen suyễn, COPD, viêm phổi", CssClass="hg-warning",
                    BadgeColor="#F5A623", BadgeText="#333", BadgeLabel="Theo dõi",
                    Tips=new(){"Mang theo thuốc xịt hen theo người","Không tập thể dục ngoài trời khi AQI > 50","Sử dụng máy lọc không khí HEPA","Liên hệ bác sĩ nếu triệu chứng nặng hơn"}
                },
                new HealthGroup {
                    Icon="👴", Name="Người cao tuổi (> 65)",
                    RiskLevel="Hệ miễn dịch yếu hơn", CssClass="hg-moderate",
                    BadgeColor="#2DC653", BadgeText="#333", BadgeLabel="Bình thường",
                    Tips=new(){"Nên tập thể dục trong nhà vào giờ cao điểm","Uống đủ 2 lít nước mỗi ngày","Kiểm tra AQI trước khi ra ngoài"}
                },
            };

            DoList = new() {
                "🪟 Đóng cửa sổ khi AQI > 100","🌿 Trồng cây lọc không khí trong nhà",
                "🏃 Tập thể dục trong nhà hoặc sáng sớm","💧 Uống đủ 2 lít nước mỗi ngày",
                "😷 Đeo khẩu trang N95 khi ra đường","🌡️ Theo dõi AQI thường xuyên",
            };
            DontList = new() {
                "🚗 Đốt rác, đốt than trong nhà","🏃 Chạy bộ ven đường lúc tan tầm",
                "🪟 Mở cửa sổ khi AQI > 150","🚬 Hút thuốc lá trong không gian kín",
                "🏋️ Tập thể dục mạnh ngoài trời","👶 Cho trẻ nhỏ ra ngoài lâu khi AQI > 100",
            };

            HealthIndexes = new List<HealthIndex>
            {
                new(){Icon="🌬️",Name="Chất lượng không khí", Description="Chỉ số AQI trung bình hôm nay",   Percent=65,Value="65/100", Color="#F5A623"},
                new(){Icon="💧",Name="Độ ẩm không khí",       Description="Mức tối ưu: 40–60%",             Percent=72,Value="72%",    Color="#1B8CDE"},
                new(){Icon="🌡️",Name="Nhiệt độ",              Description="Nhiệt độ trung bình ngày",       Percent=55,Value="28°C",   Color="#E8622A"},
                new(){Icon="💨",Name="Tốc độ gió",            Description="Gió giúp phân tán ô nhiễm",      Percent=40,Value="12 km/h",Color="#2DC653"},
                new(){Icon="☁️",Name="Chỉ số UV",             Description="Mức bức xạ tia cực tím",         Percent=80,Value="8/11",   Color="#D93B3B"},
            };

            MaskAdvice = new List<MaskItem>
            {
                new(){Name="Khẩu trang y tế", Efficiency="~70%",   Recommended=false},
                new(){Name="Khẩu trang N95",  Efficiency="≥95%",   Recommended=true},
                new(){Name="Khẩu trang KN95", Efficiency="≥95%",   Recommended=true},
                new(){Name="Khẩu trang P100", Efficiency="≥99.9%", Recommended=true},
            };
        }
    }
}
