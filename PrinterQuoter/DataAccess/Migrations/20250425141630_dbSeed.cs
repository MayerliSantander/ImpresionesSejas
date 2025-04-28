using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class dbSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var adminRoleId   = "2471edde-b147-46d1-9bab-82174b9046e1";
            var clientRoleId = "dd6861fb-d6b2-40a6-a605-a5d53221d582";
            var adminUserId   = "437c87ea-cc36-4977-a3ae-ab3400832a8e";
            var adminGoogleId = "111484560705852915048";
            
            migrationBuilder.Sql($@"
                INSERT INTO `Roles` (`Id`, `Description`)
                VALUES
                  ('{adminRoleId}',   'admin'),
                  ('{clientRoleId}', 'client');
            ");
            
            migrationBuilder.Sql($@"
                INSERT INTO `Users` (`Id`, `GoogleId`, `UserName`, `Email`, `Phone`)
                VALUES
                  ('{adminUserId}', '{adminGoogleId}', 'Mayerli Santander', 'mayerlisantander0@gmail.com', '');
            ");
            
            migrationBuilder.Sql($@"
                INSERT INTO `RoleUser` (`UsersId`, `RolesId`)
                VALUES
                  ('{adminUserId}', '{adminRoleId}');
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                DELETE FROM `RoleUser`
                WHERE `UsersId` = '437c87ea-cc36-4977-a3ae-ab3400832a8e'
                  AND `RolesId` = '2471edde-b147-46d1-9bab-82174b9046e1';
            ");
                migrationBuilder.Sql(@"
                DELETE FROM `Users`
                WHERE `Id` = '437c87ea-cc36-4977-a3ae-ab3400832a8e';
            ");
                migrationBuilder.Sql(@"
                DELETE FROM `Roles`
                WHERE `Id` IN (
                  '2471edde-b147-46d1-9bab-82174b9046e1',
                  'dd6861fb-d6b2-40a6-a605-a5d53221d582'
                );
            ");
        }
    }
}
