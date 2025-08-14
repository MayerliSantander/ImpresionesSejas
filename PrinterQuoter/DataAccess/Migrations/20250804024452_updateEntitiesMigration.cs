using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class updateEntitiesMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Quotations_Order_OrderId",
                table: "Quotations");

            migrationBuilder.DropForeignKey(
                name: "FK_Quotations_Order_OrderId1",
                table: "Quotations");

            migrationBuilder.DropTable(
                name: "QuotationProducts");

            migrationBuilder.DropIndex(
                name: "IX_Quotations_OrderId",
                table: "Quotations");

            migrationBuilder.DropIndex(
                name: "IX_Quotations_OrderId1",
                table: "Quotations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Order",
                table: "Order");

            migrationBuilder.DropColumn(
                name: "OrderId1",
                table: "Quotations");

            migrationBuilder.RenameTable(
                name: "Order",
                newName: "Orders");

            migrationBuilder.AlterColumn<Guid>(
                name: "OrderId",
                table: "Quotations",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "DocumentPath",
                table: "Quotations",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "QuotationId",
                table: "Orders",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Orders",
                table: "Orders",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "QuotationDetails",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    QuotationId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ProductId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    MaterialId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationDetails", x => x.Id);
                    table.ForeignKey(
                        name: "FK_QuotationDetails_Materials_MaterialId",
                        column: x => x.MaterialId,
                        principalTable: "Materials",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationDetails_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationDetails_Quotations_QuotationId",
                        column: x => x.QuotationId,
                        principalTable: "Quotations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ActivityQuotationDetail",
                columns: table => new
                {
                    ActivitiesId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    QuotationDetailsId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityQuotationDetail", x => new { x.ActivitiesId, x.QuotationDetailsId });
                    table.ForeignKey(
                        name: "FK_ActivityQuotationDetail_Activities_ActivitiesId",
                        column: x => x.ActivitiesId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ActivityQuotationDetail_QuotationDetails_QuotationDetailsId",
                        column: x => x.QuotationDetailsId,
                        principalTable: "QuotationDetails",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Id",
                table: "Orders",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_QuotationId",
                table: "Orders",
                column: "QuotationId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ActivityQuotationDetail_QuotationDetailsId",
                table: "ActivityQuotationDetail",
                column: "QuotationDetailsId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationDetails_MaterialId",
                table: "QuotationDetails",
                column: "MaterialId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationDetails_ProductId",
                table: "QuotationDetails",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_QuotationDetails_QuotationId",
                table: "QuotationDetails",
                column: "QuotationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Quotations_QuotationId",
                table: "Orders",
                column: "QuotationId",
                principalTable: "Quotations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Quotations_QuotationId",
                table: "Orders");

            migrationBuilder.DropTable(
                name: "ActivityQuotationDetail");

            migrationBuilder.DropTable(
                name: "QuotationDetails");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Orders",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_Id",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_QuotationId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DocumentPath",
                table: "Quotations");

            migrationBuilder.DropColumn(
                name: "QuotationId",
                table: "Orders");

            migrationBuilder.RenameTable(
                name: "Orders",
                newName: "Order");

            migrationBuilder.AlterColumn<Guid>(
                name: "OrderId",
                table: "Quotations",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "OrderId1",
                table: "Quotations",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Order",
                table: "Order",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "QuotationProducts",
                columns: table => new
                {
                    ProductsId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    QuotationsId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_QuotationProducts", x => new { x.ProductsId, x.QuotationsId });
                    table.ForeignKey(
                        name: "FK_QuotationProducts_Products_ProductsId",
                        column: x => x.ProductsId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_QuotationProducts_Quotations_QuotationsId",
                        column: x => x.QuotationsId,
                        principalTable: "Quotations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Quotations_OrderId",
                table: "Quotations",
                column: "OrderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Quotations_OrderId1",
                table: "Quotations",
                column: "OrderId1",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_QuotationProducts_QuotationsId",
                table: "QuotationProducts",
                column: "QuotationsId");

            migrationBuilder.AddForeignKey(
                name: "FK_Quotations_Order_OrderId",
                table: "Quotations",
                column: "OrderId",
                principalTable: "Order",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Quotations_Order_OrderId1",
                table: "Quotations",
                column: "OrderId1",
                principalTable: "Order",
                principalColumn: "Id");
        }
    }
}
