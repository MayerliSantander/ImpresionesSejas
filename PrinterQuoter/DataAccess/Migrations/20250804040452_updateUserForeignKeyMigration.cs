using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateUserForeignKeyMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId1",
                table: "Quotations",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateIndex(
                name: "IX_Quotations_UserId1",
                table: "Quotations",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Quotations_Users_UserId1",
                table: "Quotations",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
