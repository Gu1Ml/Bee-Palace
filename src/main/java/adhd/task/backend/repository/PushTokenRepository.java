package adhd.task.backend.repository;

import adhd.task.backend.entity.PushToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PushTokenRepository extends JpaRepository<PushToken, UUID> {

    // METODO CORRETO (com @Query)
    @Query("SELECT p FROM PushToken p WHERE p.deviceToken = :deviceToken AND p.user.id = :userId")
    Optional<PushToken> findByDeviceTokenAndUserId(
            @Param("deviceToken") String deviceToken,
            @Param("userId") UUID userId
    );

    @Query("SELECT p FROM PushToken p WHERE p.user.id = :userId AND p.isActive = true")
    List<PushToken> findByUserIdAndIsActiveTrue(@Param("userId") UUID userId);

    @Query("SELECT p FROM PushToken p WHERE p.user.id = :userId")
    List<PushToken> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT COUNT(p) FROM PushToken p WHERE p.user.id = :userId AND p.isActive = true")
    long countActiveTokensByUserId(@Param("userId") UUID userId);

    @Query("DELETE FROM PushToken p WHERE p.user.id = :userId")
    void deleteByUserId(@Param("userId") UUID userId);
}