using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateProductsMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "Products",
                newName: "ImageUrls");

            migrationBuilder.AddColumn<string>(
                name: "SizeInCm",
                table: "Products",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SizeInCm",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "ImageUrls",
                table: "Products",
                newName: "ImageUrl");
        }
    }
}
