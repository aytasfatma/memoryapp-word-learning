using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MemoryApp.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddProgressTrackingFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalAttempts",
                table: "UserWordProgresses",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TotalCorrect",
                table: "UserWordProgresses",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalAttempts",
                table: "UserWordProgresses");

            migrationBuilder.DropColumn(
                name: "TotalCorrect",
                table: "UserWordProgresses");
        }
    }
}
